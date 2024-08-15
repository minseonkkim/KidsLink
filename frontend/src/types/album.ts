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
  