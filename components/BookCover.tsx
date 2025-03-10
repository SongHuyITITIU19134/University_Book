import { cn } from "@/lib/utils";
import Image from "next/image";
import BookCoverSvg from "./BookCoverSVG";




const variantStyles: Record<BookCoverVariant, string> = {
    small: 'book-cover_small',
    default: 'book-cover',
    wide: 'book-cover_wide',
}
type BookCoverVariant = 'small' | 'default' | 'wide';

interface Props {
    className?: string;
    variant?: BookCoverVariant;
    coverColor: string;
    coverImage: string;
}
const BookCover = ({
    className,
    variant = "default",
    coverColor = "#012B48",
    coverImage = "https://placehold.co/400x600.png" }: Props) => {
    return (
        <div className={cn(
            "relative transition-all duration-300",
            variantStyles[variant],
            className,
        )}>

            <BookCoverSvg coverColor={coverColor} />
            <div className="absolute z-10" style={{ left: "12%", width: "87.5%", height: "88%" }}>
                <Image
                    src={coverImage}
                    alt="BookCover"
                    fill className="rounded-sm object-fill" />
            </div>
        </div>
    )
}

export default BookCover