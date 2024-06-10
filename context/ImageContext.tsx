import React, { createContext, useState, ReactNode } from 'react';

type ImageContextType = {
    selectedImage: string | null;
    setSelectedImage: (image: string | null) => void;
};

export const ImageContext = createContext<ImageContextType | undefined>(undefined);

export const ImageProvider = ({ children }: { children: ReactNode }) => {
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    return (
        <ImageContext.Provider value={{ selectedImage, setSelectedImage }}>
            {children}
        </ImageContext.Provider>
    );
};
