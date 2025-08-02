import Image from "next/image";
import React from "react";

interface EmptyProps {
  image?: React.ReactNode;
  imageStyle?: React.CSSProperties;
  description?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}

const DefaultEmptyImage = () => (
  <Image width={64} height={64} quality={100} src="/empty.webp" alt="Empty" unoptimized />
);

const Empty: React.FC<EmptyProps> = ({
  image = <DefaultEmptyImage />,
  imageStyle,
  description = "No Data",
  children,
  className = "",
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center p-8 ${className}`}
    >
      <div className="mb-4" style={imageStyle}>
        {image}
      </div>
      {description && (
        <div className="text-gray-500 text-sm mb-4">{description}</div>
      )}
      {children && <div className="mt-2">{children}</div>}
    </div>
  );
};

export default Empty;
