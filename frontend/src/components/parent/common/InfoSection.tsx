interface InfoSectionProps {
  main1?: string;
  main2?: string;
  description1?: string;
  description2?: string;
  imageSrc: string;
  altText: string;
}

export default function InfoSection({ description1 = "", main1="", main2="", description2 = "", imageSrc, altText }: InfoSectionProps) {
  return (
    <div className="flex items-center justify-center mt-4">
      <div className="text-center ml-4 font-medium">
        <p className="text-xl">{description1}</p>
        <p className="text-2xl font-bold">{main1}<span className="text-xl font-medium">{main2}</span></p>
        <p className="text-xl mb-10">{description2}</p>
      </div>
      <img
        src={imageSrc}
        className="max-w-[150px] h-auto object-contain ml-4"
        alt={altText}
      />
    </div>
  )
}
