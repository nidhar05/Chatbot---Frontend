// export default function Message({ msg, sender, onEdit, isEditing, onSave  }) {
//   return (
//     <div className={`message ${sender}`}>  
//       {isEditing ? (
//         <input
//           value={msg}
//           onChange={(e) => onSave(e.target.value, false)}
//           autoFocus
//         />
//       ) : (
//         msg
//       )}
//     </div>    
//   );
// }

import { useState } from "react";

export default function Message({ msg, sender, isEditing, onSave }) {
  const [text, setText] = useState(msg);

  return (
    <div className={`message ${sender}`}>
      {isEditing ? (
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onBlur={() => onSave(text)}
          onKeyDown={(e) => e.key === "Enter" && onSave(text)}
          autoFocus
        />
      ) : (
        msg
      )}
    </div>
  );
}
