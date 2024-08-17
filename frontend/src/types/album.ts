export interface ImageItem {
    path: string;
    imageId: number;
  }
  
export interface Child{
  childId: number;
  name: string;
  kindergartenClassName: string;
  kindergartenName: string;
  gender: string;
  birth: string;
  profile: string;
}

export interface AlbumItem {
  child: Child | null;
  images: ImageItem[];
}

export interface DragItem {
  index: number;
  itemIndex: number;
  type: string;
}

export interface Album {
  albumId: number;
  albumName: string;
  albumDate: string;
  images: { path: string }[];
}

interface TaggedPhoto{
  childId: number;
  photos: number[];
}

export interface SendData{
  albumName: string;
  taggedPhotos: TaggedPhoto[];
}


