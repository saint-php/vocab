export default function PrimaryButton({ text }) {
  return (
    <button className="bg-purple-600 hover:bg-purple-700 transition text-white px-6 py-3 rounded-xl font-semibold w-full">
      {text}
    </button>
  )
}