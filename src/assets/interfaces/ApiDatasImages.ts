export interface DatasImages {
    data: Daum[]
    meta: Meta
}

export interface Daum {
    id: number
    attributes: Attributes
}

export interface Attributes {
    steps: string
    seed: string
    generator: string
    model: string
    cfg_scale: string
    negative_prompt: string
    prompt: string
    width: string
    height: string
    createdAt: string
    updatedAt: string
    publishedAt: string
    image: Image
    tag: Tag
}

export interface Image {
    data: Data
}

export interface Data {
    id: number
    attributes: Attributes2
}

export interface Attributes2 {
    name: string
    alternativeText: any
    caption: any
    width: number
    height: number
    formats: Formats
    hash: string
    ext: string
    mime: string
    size: number
    url: string
    previewUrl: any
    provider: string
    provider_metadata: any
    createdAt: string
    updatedAt: string
}

export interface Formats {
    thumbnail: Thumbnail
    small: Small
    medium: Medium
    large: Large
}

export interface Thumbnail {
    name: string
    hash: string
    ext: string
    mime: string
    path: any
    width: number
    height: number
    size: number
    url: string
}

export interface Small {
    name: string
    hash: string
    ext: string
    mime: string
    path: any
    width: number
    height: number
    size: number
    url: string
}

export interface Medium {
    name: string
    hash: string
    ext: string
    mime: string
    path: any
    width: number
    height: number
    size: number
    url: string
}

export interface Large {
    name: string
    hash: string
    ext: string
    mime: string
    path: any
    width: number
    height: number
    size: number
    url: string
}

export interface Tag {
    data: any
}

export interface Meta {
    pagination: Pagination
}

export interface Pagination {
    page: number
    pageSize: number
    pageCount: number
    total: number
}
