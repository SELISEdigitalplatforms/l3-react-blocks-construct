// interface StatusCircleProps {
//   status: string;
// }

// export function StatusCircle({ status }: StatusCircleProps) {
//   if (status === 'done') {
//     return (
//       <div className="w-4 h-4 rounded-full border-2 border-green-400 flex items-center justify-center">
//         <svg
//           className="w-3 h-3 text-green-400"
//           fill="none"
//           stroke="currentColor"
//           viewBox="0 0 24 24"
//           xmlns="http://www.w3.org/2000/svg"
//         >
//           <path
//             strokeLinecap="round"
//             strokeLinejoin="round"
//             strokeWidth="3"
//             d="M5 13l4 4L19 7"
//           ></path>
//         </svg>
//       </div>
//     );
//   }

//   return <div className="w-4 h-4 rounded-full border-2 border-dashed border-blue-400"></div>;
// }

interface StatusCircleProps {
  isCompleted: boolean;
}

export function StatusCircle({ isCompleted }: StatusCircleProps) {
  if (isCompleted) {
    return (
      <div className="w-4 h-4 rounded-full border-2 border-secondary flex items-center justify-center">
        <svg
          className="w-3 h-3 text-secondary"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="3"
            d="M5 13l4 4L19 7"
          ></path>
        </svg>
      </div>
    );
  }

  return <div className="w-4 h-4 rounded-full border-2 border-dashed border-secondary"></div>;
}
