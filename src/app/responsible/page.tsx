'use client'
import { Rate } from '@/components/ui/rate';
import { secureHtmlLinks } from '@/lib/htmlUtils';
import { Responsibile } from '@/types';
import { Spinner } from '@heroui/spinner';
import { useLocale, useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { set } from 'react-hook-form';

function Responsible() {
    const locale = useLocale();
    const t = useTranslations();
    const [responsible, setResponsible] = React.useState<Responsibile>({} as Responsibile);
    const [rating, setRating] = useState<number>(0);
    const router = useRouter();
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        const res = sessionStorage.getItem("responsible");
        if (res) {
            const parsedRes = JSON.parse(res);
            setResponsible(parsedRes);
            const rating = Number(Math.round(parseFloat(parsedRes.rate))) as number;
            setRating(rating);
            setIsLoading(false);
        } else {
            router.back();
        }
    }, []);

    return (
        <>
           {
            !isLoading ? (
                 <section dir='ltr' className="min-h-screen bg-transparent py-16 px-6 flex flex-col md:flex-row items-start justify-between gap-8 ">
                <div className="w-full md:w-5/12 flex justify-center h-full md:justify-end">
                    {
                        responsible?.image !== null ? (
                            <img
                                src={responsible?.image}
                                alt="About Me"
                                className="w-72 h-96 md:w-80 lg:w-96 object-cover rounded-lg shadow-lg"
                            />
                        ) : (
                            <img
                                src='/user.webp'
                                alt="About Me"
                                className="w-72 h-96 md:w-80 lg:w-96 object-cover rounded-lg shadow-lg"
                            />
                        )
                    }
                </div>
                <div className="w-full md:w-7/12 text-center md:text-left relative">

                    <div className="absolute text-main-500 left-[40%] -top-6 md:-left-16  lg:top-0 md:top-6 rotate-0 md:rotate-[-90deg] text-sm tracking-widest">
                        <div className="flex items-center justify-center gap-2">
                            <div className="w-16 h-[2px] bg-main-500"></div>
                            <p>{t("MoreAbout")}</p>
                        </div>
                    </div>
                    <h2 className="text-3xl md:text-5xl font-bold leading-tight mb-4 pl-10">
                        {responsible?.name?.split(' ')[0]} <br /> {responsible?.name?.split(' ')[1]}
                    </h2>

                    <div
                        dir={locale === 'ar' ? 'rtl' : 'ltr'}
                        className={"flex flex-col md:flex-row gap-10 justify-center md:justify-start mt-10 mb-8 " + (locale === 'ar' ? "text-right md:mr-25" : "text-left md:mr-25")}
                    >
                        <p>{t("Experience")} {` : ${responsible?.experience_years || 0}`} {t("Years")}</p>

                        <p>{t("articles_number")} {` : ${responsible?.articles_number || 0}`}</p>

                        {
                            typeof responsible?.rate === 'string' && (
                                <div className="flex items-center gap-2">
                                    <Rate
                                        defaultValue={rating}
                                        readOnly
                                    />
                                    <span>{parseFloat(responsible?.rate) || 0}</span>
                                </div>
                            )
                        }
                    </div>

                    <div
                        dir='rtl'
                        className="text-black mb-6 text-sm md:text-base leading-relaxed max-w-2xl mx-auto md:mx-0 text-right"
                        dangerouslySetInnerHTML={{ __html: secureHtmlLinks(responsible?.long_content as string) }}
                    />
                </div>
            </section>
            ) : (
                <div className='w-full h-screen flex items-center justify-center'>
                    <Spinner />
                </div>
            )
           }
        </>
    )
}

export default Responsible
