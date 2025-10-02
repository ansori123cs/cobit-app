import Image from 'next/image';

type AvatarProps = {
  id: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
};

const Avatar = ({ id, alt, width = 64, height = 64, className = '' }: AvatarProps) => {
  return (
    <div className={`rounded-full overflow-hidden ${className}`} style={{ width, height }}>
      <Image src={`/avatars/${id}.png`} alt={alt} width={width} height={height} className='object-cover w-full h-full' />
    </div>
  );
};
export default Avatar;
