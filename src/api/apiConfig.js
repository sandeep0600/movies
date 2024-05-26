const apiConfig = {
    baseUrl: 'https://api.themoviedb.org/3',
    apiKey: '73bbcb846da6fff8be578b7da63fadd2',
    apiReadAccessToken: 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI3M2JiY2I4NDZkYTZmZmY4YmU1NzhiN2RhNjNmYWRkMiIsInN1YiI6IjY2NTFiZDYxMDJmMjk0Zjc1MTI2ZjE1NCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.24VOm8isrbIHqYZ9XwPkfmc3sGam754W-k2BQFKA4kg',
    originalImage: (imgPath) => `https://image.tmdb.org/t/p/original/${imgPath}`,
    w500Image: (imgPath) => `https://image.tmdb.org/t/p/w500/${imgPath}`
};

export default apiConfig;
