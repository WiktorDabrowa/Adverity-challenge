'use client'

export default function FilePreview({params}: {params: {fileId: string}}) {
    return(
        <div>File details {params.fileId}</div>
    )
}
