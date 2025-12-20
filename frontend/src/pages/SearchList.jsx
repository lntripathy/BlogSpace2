import BlogCard from '@/components/BlogCard';
import React, { useEffect } from 'react'
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';

const SearchList = () => {
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const query = params.get('q');
    const { blog } = useSelector(store => store.blog)

    console.log(blog);


    const filteredBlogs = Array.isArray(blog)
        ? blog.filter((item) => {
            const q = query?.toLowerCase() || "";

            return (
                item?.title?.toLowerCase().includes(q) ||
                item?.subtitle?.toLowerCase().includes(q) ||
                item?.category?.toLowerCase().includes(q)
            );
        })
        : [];


    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])
    return (
        <div className='pt-32'>
            <div className='max-w-6xl mx-auto'>
                <h2 className='mb-5'>Search Results for: "{query}"</h2>
                {/* Here you can fetch data or display filtered results based on the query */}
                {filteredBlogs.length === 0 ? (
                    <p className="text-center text-gray-500 text-lg mt-10">
                        No data found
                    </p>
                ) : (
                    <div className='grid grid-cols-1 md:grid-cols-3 gap-7 my-10'>
                        {filteredBlogs.map((blog) => (
                            <BlogCard key={blog._id} blog={blog} />
                        ))}
                    </div>
                )}

            </div>
        </div>
    )
}

export default SearchList
