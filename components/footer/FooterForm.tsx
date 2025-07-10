"use client";

import Btn from "../Button";

export default function FooterForm() {
  return (
    <form
      action=""
      className="border-2 border-gray-300 dark:border-white bg-gray-200 dark:bg-gray-950 rounded-lg p-[4px] max-w-[400px] flex justify-between"
    >
      <input
        type="email"
        placeholder="example@email.com"
        className="input-fields w-full outline-0"
      />
      <Btn
        onClick={(e) => {
          e.preventDefault()
        }}
        className="bg-light-4 dark:bg-gray-100 text-white dark:text-black  w-fit font-bold text-lg p-2 rounded-sm"
      >
        Submit
      </Btn>
    </form>
  );
}
