import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import BlogCardList from './BlogCardList'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { useNavigate } from 'react-router-dom'
import { setBlog } from '@/redux/blogSlice'
import axios from 'axios'

const tags = [
  { category: "Blogging" },
  { category: "Web Development" },
  { category: "Digital Marketing" },
  { category: "Cooking" },
  { category: "Photography" },
  { category: "Sports" },
]

const RecentBlog = () => {
  const { blog } = useSelector(store => store.blog)
  const navigate = useNavigate()
  const dispatch = useDispatch()

  useEffect(() => {
    const getAllPublishedBlogs = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8000/api/v1/blog/get-published-blogs`,
          { withCredentials: true }
        )
        if (res.data.success) {
          dispatch(setBlog(res.data.blogs))
        }
      } catch (error) {
        console.log(error)
      }
    }
    getAllPublishedBlogs()
  }, [dispatch])

  // 🔥 MOST LIKED BLOGS (DESCENDING)
  const suggestedBlogs = [...(blog || [])]
    .sort((a, b) => (b.likes?.length || 0) - (a.likes?.length || 0))
    .slice(0, 3)

  return (
    <div className='bg-gray-100 dark:bg-gray-800 pb-10'>
      <div className='max-w-6xl mx-auto flex flex-col space-y-4 items-center'>
        <h1 className='text-4xl font-bold pt-10'>Recent Blogs</h1>
        <hr className='w-24 border-2 border-red-500 rounded-full' />
      </div>

      <div className='max-w-7xl mx-auto flex gap-6'>
        {/* LEFT SIDE – BLOG LIST */}
        <div className='flex-1'>
          <div className='mt-10 px-4 md:px-0'>
            {blog?.slice(0, 4)?.map((item) => (
              <BlogCardList key={item._id} blog={item} />
            ))}
          </div>
        </div>

        {/* RIGHT SIDE – SIDEBAR */}
        <div className='bg-white hidden md:block dark:bg-gray-700 w-[350px] p-5 rounded-md mt-10'>
          <h1 className='text-2xl font-semibold'>Popular categories</h1>
          <div className='my-5 flex flex-wrap gap-3'>
            {tags.map((item, index) => (
              <Badge
                key={index}
                onClick={() => navigate(`/search?q=${item.category}`)}
                className="cursor-pointer"
              >
                {item.category}
              </Badge>
            ))}
          </div>

          <h1 className='text-xl font-semibold'>Subscribe to Newsletter</h1>
          <p className='text-sm text-gray-600 dark:text-gray-400'>
            Get the latest posts and updates delivered straight to your inbox.
          </p>

          <div className="flex flex-col sm:flex-row gap-2 mt-5">
            <Input
              type="email"
              placeholder="Enter your email"
              className="bg-gray-200 dark:bg-gray-800"
            />
            <Button>Subscribe</Button>
          </div>

          {/* ⭐ SUGGESTED BLOGS (MOST LIKED) */}
          <div className='mt-7'>
            <h2 className="text-xl font-semibold mb-3">Suggested Blogs</h2>

            {suggestedBlogs.length === 0 ? (
              <p className="text-sm text-gray-500">No blogs found</p>
            ) : (
              <ul className="space-y-3">
                {suggestedBlogs.map((item) => (
                  <li
                    key={item._id}
                    onClick={() => navigate(`/blogs/${item._id}`)}
                    className="text-sm dark:text-gray-100 hover:underline cursor-pointer flex justify-between"
                  >
                    <span>{item.title}</span>
                    <span className="text-xs text-gray-400">
                      ❤️ {item.likes?.length || 0}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default RecentBlog
