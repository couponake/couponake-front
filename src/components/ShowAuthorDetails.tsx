"use client";
import { Drawer, DrawerContent, DrawerTitle } from '@/components/ui/drawer';
import { Responsibile } from '@/types';
import { Button } from '@heroui/button';
import { Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from '@heroui/react';
import { X } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import Image from 'next/image';
import React from 'react';

import { Rate } from './ui/rate';

interface authorProps {
  author: Responsibile;
  openDrawer: boolean;
  onClose: () => void;
}

const ShowAuthorDetails = ({ author, openDrawer, onClose }: authorProps) => {
  const t = useTranslations();
  const locale = useLocale();

  //responsible
  const getResponsible = () => {
    sessionStorage.setItem('responsible', JSON.stringify(author));
    window.location.href = "/responsible";
  }

  return (
    <Drawer open={openDrawer} onClose={onClose}>
      <DrawerTitle className="hidden">
        <span>{author?.name}</span>
      </DrawerTitle>
      <DrawerContent
        className="container h-fit max-w-screen-md mx-auto mb-10 flex flex-col gap-5 justify-center items-center"
      >
        <Button
          onPress={onClose}
          isIconOnly
          className="absolute top-2 start-4 rounded-full hover:bg-red-100 transition-colors duration-200"
          aria-label={t("Close")}
        >
          <X className="size-4" />
        </Button>
        <div className='w-full h-fit flex flex-col gap-2 justify-center items-center'>
          <div className="w-35 aspect-square">
            <Image
              src={author?.image ? author?.image : "/user.webp"}
              alt={author?.image ? author?.name : "user"}
              width={140}
              height={140}
              loading="lazy"
              className="size-full object-cover rounded-full"
              unoptimized
            />
          </div>
          <p className='text-sm xl:text-md'>{t("Article Author")}</p>
          {
            author?.rate !== null && typeof author?.rate === 'string' && (
              <div className="flex items-center gap-2">
                <Rate
                  defaultValue={Number(Math.round(parseFloat(author?.rate)))}
                  readOnly
                />
                <span>{parseFloat(author?.rate) || 0}</span>
              </div>
            )
          }
        </div>
        <div className='mx-auto'>
          <Table hideHeader isStriped aria-label="Author Details">
            <TableHeader>
              <TableColumn>{"Title"}</TableColumn>
              <TableColumn>{"Value"}</TableColumn>
            </TableHeader>
            <TableBody>
              <TableRow key="1">
                <TableCell>{t("Name")}</TableCell>
                <TableCell>{author?.name}</TableCell>
              </TableRow>
              <TableRow key="2" className="bg-gray-100">
                <TableCell>{t("Experience")}</TableCell>
                <TableCell>{author?.experience_years || 0} {` ${t("Years")}`}</TableCell>
              </TableRow>
              <TableRow key="3">
                <TableCell>{t("articles_number")}</TableCell>
                <TableCell>{author?.articles_number || 0}</TableCell>
              </TableRow>
              <TableRow key="4" className="bg-gray-100">
                <TableCell>{t("Brief")}</TableCell>
                <TableCell dir='rtl'>{author?.short_content}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
        <div className='w-full h-full flex items-center justify-center'>
          <span
            className="w-fit font-normal text-white rounded-md px-4 py-2 text-sm bg-main-500 hover:bg-main-600 cursor-pointer"
            onClick={getResponsible}
          >
            {t("Read more")}
          </span>
        </div>

      </DrawerContent>
    </Drawer>
  );
};

export default ShowAuthorDetails;
