import { Edit, Save, Undo2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { TableDataType } from "./IssueTable";
import { useState } from "react";

type updateOption = {
  row: TableDataType;
  value: string;
  whichOption: string;
};

type Props = {
  row: TableDataType;
  mutate: (parm: updateOption) => void;
};

const animationProps = {
  initial: { opacity: 0, y: -5 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -5 },
  transition: { duration: 0.1 },
};

export const EditTitle = ({ row, mutate }: Props) => {
  const [enableEdit, setEnableEdit] = useState(false);
  const [title, setTitle] = useState(row.title);

  const handleUndo = () => {
    setTitle(row.title);
    setEnableEdit(false);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    mutate({ row, value: title, whichOption: "title" });
    setEnableEdit(false);
  };

  return (
    <div className="flex items-center gap-2 w-full">
      <AnimatePresence mode="wait">
        {enableEdit ? (
          <motion.form
            key="edit"
            onSubmit={handleSave}
            {...animationProps}
            className="flex items-center gap-2 w-full"
          >
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="flex-grow px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 transition w-full"
              autoFocus
            />
            <button
              type="button"
              onClick={handleUndo}
              className="p-1 hover:bg-gray-100 rounded-md transition"
              title="Cancel"
            >
              <Undo2 size={18} className="text-gray-600" />
            </button>
            <button
              type="submit"
              className="p-1 hover:bg-gray-100 rounded-md transition"
              title="Save"
            >
              <Save size={18} className="text-gray-600" />
            </button>
          </motion.form>
        ) : (
          <motion.div
            key="view"
            {...animationProps}
            className="flex items-center gap-2 w-full"
          >
            <span className="flex-grow truncate">{row.title}</span>
            <button
              onClick={() => setEnableEdit(true)}
              className="p-1 hover:bg-gray-100 rounded-md transition"
              title="Edit"
            >
              <Edit size={17} className="text-gray-600" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const EditDescription = ({ row, mutate }: Props) => {
  const [enableEdit, setEnableEdit] = useState(false);
  const [description, setDescription] = useState(row.description);

  const handleUndo = () => {
    setDescription(row.description);
    setEnableEdit(false);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    mutate({ row, value: description, whichOption: "description" });
    setEnableEdit(false);
  };

  return (
    <div className="flex items-center gap-2 w-full">
      <AnimatePresence mode="wait">
        {enableEdit ? (
          <motion.form
            key="edit"
            onSubmit={handleSave}
            {...animationProps}
            className="flex items-center gap-2 w-full"
          >
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="flex-grow px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 transition w-full"
              autoFocus
            />
            <button
              type="button"
              onClick={handleUndo}
              className="p-1 hover:bg-gray-100 rounded-md transition"
              title="Cancel"
            >
              <Undo2 size={18} className="text-gray-600" />
            </button>
            <button
              type="submit"
              className="p-1 hover:bg-gray-100 rounded-md transition"
              title="Save"
            >
              <Save size={18} className="text-gray-600" />
            </button>
          </motion.form>
        ) : (
          <motion.div
            key="view"
            {...animationProps}
            className="flex items-center gap-2 w-full"
          >
            <span className="flex-grow truncate">{row.description}</span>
            <button
              onClick={() => setEnableEdit(true)}
              className="p-1 hover:bg-gray-100 rounded-md transition"
              title="Edit"
            >
              <Edit size={17} className="text-gray-600" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
