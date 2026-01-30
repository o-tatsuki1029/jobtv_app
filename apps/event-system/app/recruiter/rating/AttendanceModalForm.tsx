// components/EventModalForm.tsx
"use client";

type AttendanceFormProps = {
  onClose: () => void;
};

export default function EventModalForm({}: AttendanceFormProps) {
  return (
    <form className="w-full pb-6">
      <h2 className="text-xl font-bold mb-6">学生評価</h2>
      <p>オカド タツキ</p>

      <h3>総合評価</h3>
      <div className="grid grid-cols-4 gap-4 mb-5">
        <button className="bg-blue-500 text-white px-10 py-2 rounded hover:bg-blue-600 w-full">
          S
        </button>
        <button className="bg-blue-500 text-white px-10 py-2 rounded hover:bg-blue-600 w-full">
          A
        </button>
        <button className="bg-blue-500 text-white px-10 py-2 rounded hover:bg-blue-600 w-full">
          B
        </button>
        <button className="bg-blue-500 text-white px-10 py-2 rounded hover:bg-blue-600 w-full">
          C
        </button>
      </div>
      <h3>コメント</h3>
      <input
        className="h-10 mb-10 px-2 py-2 rounded border w-full"
        type="textarea"
      />
      <h3>課題解決力</h3>
      <div className="grid grid-cols-4 gap-4 mb-5">
        <button className="bg-blue-500 text-white px-10 py-2 rounded hover:bg-blue-600 w-full">
          S
        </button>
        <button className="bg-blue-500 text-white px-10 py-2 rounded hover:bg-blue-600 w-full">
          A
        </button>
        <button className="bg-blue-500 text-white px-10 py-2 rounded hover:bg-blue-600 w-full">
          B
        </button>
        <button className="bg-blue-500 text-white px-10 py-2 rounded hover:bg-blue-600 w-full">
          C
        </button>
      </div>
      <h3>積極性</h3>
      <div className="grid grid-cols-4 gap-4 mb-5">
        <button className="bg-blue-500 text-white px-10 py-2 rounded hover:bg-blue-600 w-full">
          S
        </button>
        <button className="bg-blue-500 text-white px-10 py-2 rounded hover:bg-blue-600 w-full">
          A
        </button>
        <button className="bg-blue-500 text-white px-10 py-2 rounded hover:bg-blue-600 w-full">
          B
        </button>
        <button className="bg-blue-500 text-white px-10 py-2 rounded hover:bg-blue-600 w-full">
          C
        </button>
      </div>
      <h3>協調力</h3>
      <div className="grid grid-cols-4 gap-4 mb-5">
        <button className="bg-blue-500 text-white px-10 py-2 rounded hover:bg-blue-600 w-full">
          S
        </button>
        <button className="bg-blue-500 text-white px-10 py-2 rounded hover:bg-blue-600 w-full">
          A
        </button>
        <button className="bg-blue-500 text-white px-10 py-2 rounded hover:bg-blue-600 w-full">
          B
        </button>
        <button className="bg-blue-500 text-white px-10 py-2 rounded hover:bg-blue-600 w-full">
          C
        </button>
      </div>

      <h3>メモ※学生には表示されません</h3>
      <input
        className="h-20 mb-10 px-2 py-2 rounded border w-full"
        type="textarea"
      />
      <button
        type="submit"
        className="bg-blue-500 text-white px-10 py-2 rounded hover:bg-blue-600 w-full"
      >
        登録する
      </button>
    </form>
  );
}
