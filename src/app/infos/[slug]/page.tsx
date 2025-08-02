import React from 'react';
import { api } from '@/components/MyAxios';
import { secureHtmlLinks } from '@/lib/htmlUtils';
import moment from 'moment';

const BlogDetails = async ({
    params,
}: {
    params: Promise<{ slug: string }>;
}) => {
    const slug = (await params).slug;
    const response: any = await api.static(`info/${slug}`);
    const blog = response.data
    return (
        <main className="container mx-auto px-4 py-8">
            <article className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-6">
                    <h1 className="text-3xl font-bold mb-4 text-gray-800">{blog.title}</h1>
                    <div className="text-sm text-gray-500 mb-4">
                        {moment(blog.created_a).format('MMMM d, yyyy')}
                    </div>
                    <div
                        className="prose max-w-none"
                        dangerouslySetInnerHTML={{ __html: secureHtmlLinks(blog.description as string) }}
                    />
                </div>
            </article>
        </main>
    );
}

export default BlogDetails;
