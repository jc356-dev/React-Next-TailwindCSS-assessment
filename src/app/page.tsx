import InputBox from "@/components/input";

export default function Home() {
  return (
    <div className="my-20">
      <div className="w-10/12 sm:w-1/3 m-auto">
        <InputBox placeholder="Type /command or @mention ..." />
      </div>
    </div>
  );
}
