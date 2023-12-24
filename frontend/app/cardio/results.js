import Head from 'next/head';

const Results = () => {
  return (
    <div className="bg-gray-100 min-h-screen flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <Head>
        <title>Diagnosis Results</title>
      </Head>

      <main className="flex flex-col items-center justify-center flex-1 w-full">
        <div className="max-w-md bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6">
            <h1 className="text-3xl font-bold mb-4">Diagnosis Results</h1>
          </div>
        </div>
      </main>
    </div>
  );
}
export default Results;