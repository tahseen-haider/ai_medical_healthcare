"use client";

import Btn from "../Button";


export default function FooterForm() {
  return (
    <form action="" className="border-2 border-gray-400 rounded-lg p-[6px] flex justify-between">
      <input type="email" placeholder="example@email.com" className="w-full focus:ring-0 px-2 dark:text-gray-200"/>
      <Btn
        onClick={(e) => {
          e.preventDefault();
        }}
        className="bg-light-4 text-white"
      >
        Submit
      </Btn>
    </form>
  );
}
