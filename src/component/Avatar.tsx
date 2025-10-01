type AvatarProps = {
  id: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
};

const Avatar = ({ id, alt, width = 64, height = 64, className = '' }: AvatarProps) => {
  return (
    <div style={{ width: `${width}px`, height: `${height}px` }} className={`rounded-full ${className}`}>
      <img src={`/avatars/${id}.png`} alt={alt} className='w-full h-full  rounded-full object-cover' />
    </div>
  );
};

export default Avatar;
