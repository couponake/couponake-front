'use client'
import React from 'react'
import Image
    from 'next/image'
import Link from 'next/link'
interface similarStoreProps {
    slug: string
    image: string
    store_name: string
}
function SimilarStores({ store }: { store: similarStoreProps }) {
    return (
        <Link
            prefetch={false}
            target="_self"
            key={store?.slug}
            href={`/store/${store?.slug}`}
        >
            <div className="w-17 aspect-square p-0 rounded-full bg-white shadow-md">
                <Image
                    src={store?.image ? encodeURI(store.image) : "noPreview.webp"}
                    alt={store.store_name}
                    width={68}
                    height={68}
                    loading="lazy"
                    className="size-full object-contain rounded-full"
                />
            </div>
        </Link>
    )
}

export default SimilarStores