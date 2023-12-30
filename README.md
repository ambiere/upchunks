## upchunks

A demonstration of a robust file uploading mechanism that breaks large files into smaller chunks for efficient transfer and storage. This approach allows for handling large files without overwhelming network bandwidth and server resources.

[![js-standard-style](https://img.shields.io/badge/style-standard-brightgreen.svg?style=flat)](https://standardjs.com/) &nbsp;
[![Test](https://github.com/zhid0399123/upchunks/actions/workflows/CI.yml/badge.svg)](https://github.com/zhid0399123/upchunks/actions/workflows/CI.yml) &nbsp;
[![Deployment](https://github.com/zhid0399123/upchunks/actions/workflows/fly.yml/badge.svg)](https://github.com/zhid0399123/upchunks/actions/workflows/fly.yml) &nbsp;

## Feature(s)

1. **Server-Side Handling**: The server receives and stores file chunks (File System Storage) in preparation for merging.

2. **Chunk Merging**: Once all chunks are received, the server merges them into the original file.

3. **Integrity Validation**: Post-merging, the application verifies the integrity of the merged file to ensure data consistency.

## How It Works

1. **Chunking Process**:
   The client-side code divides the selected file into smaller chunks.
   These chunks are sequentially sent to the server for storage.

2. **Server-Side Processing**:
   The server receives, stores, and manages these chunks.
   Upon completion of chunk uploads, the server initiates the merging process.

3. **Merging Process**:
   The server combines all stored chunks into the original file.
   Post-merging, the application verifies the integrity of the merged file and store the file metadata to MongoDB. Merged file is stored in File System Storage.

## Purpose

This project serves as a fundamental demonstration of handling large file uploads by breaking them into smaller, more manageable chunks. It showcases the implementation of an efficient mechanism for handling file uploads, enabling scalability and reliability, especially when dealing with substantial data transfers.

## Notes

The project is intended for educational purposes and serves as a starting point for understanding file chunking and merging mechanisms.
Additional enhancements, error handling, security measures, and optimizations may be required for real-world use cases and deployment in production environments.

## Contributing

Contributions are welcome! Feel free to open issues or submit pull requests. Please refer to the [Contributing Guidelines](CONTRIBUTING.md) to get started.

## License

This project is licensed under the MIT License. Refer to the [LICENSE](LICENSE) file for more details.
