# NetCDFaster Frontend

## Acknowledgments
This project was developed by [Zhenlei Song](https://orcid.org/0009-0007-5205-3808) and supervised by [Dr. Zhe Zhang](https://orcid.org/0000-0001-7108-182X) from CIDI Lab, Department of Geography at Texas A&M University.

Any individuals or organizations that use this software should cite the following paper:

```
Song, Z., Zhang, Z., Sussman, A., Xie, Y., Brenner, J., & Liu, J. (2025). NetCDFaster: Optimizing NetCDF data querying and geo-visualization using high-performance machine learning. SoftwareX, 31, 102269.
```

## Getting Started

First, run the development server:

```bash
pnpm install
pnpm dev
```

## Production Build

```bash
rm -rf .next
rm -rf node_modules
pnpm install
pnpm build
pnpm start
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Configuration

Follow the `.env.example` file to create a `.env` file with the required environment variables.

## Contributing

Please fork the repository and submit pull requests for improvements.

## Contact

For questions or support, please contact [songzl@tamu.edu](mailto:songzl@tamu.edu).