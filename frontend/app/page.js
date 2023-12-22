import Image from 'next/image'

export default function Home() {
    return (
      <div className="h-screen flex justify-center items-center">
        <div className="absolute inset-0 z-0">
          {/* Background space image or gradient */}
          <div className="absolute inset-0 bg-gradient-to-b from-indigo-900 to-purple-900 opacity-75"></div>
          {/* Add more space-themed elements */}
          {/* Example: Stars or galaxy images */}
          <div className="absolute inset-0 flex items-center justify-center">
          <img
      src="https://i.pinimg.com/736x/82/13/ea/8213ea96c17c9252091ffabef45aeee3.jpg"
      alt="Space"
      className="h-full object-cover"
    />
          </div>
        </div>
        <div className="relative z-10 text-center">
          {/* Button */}
          <button a href="/survey" className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-4 rounded-full shadow-md focus:outline-none text-4xl font-semibold">
            Survey
          </button>
        </div>
      </div>
    );
}
