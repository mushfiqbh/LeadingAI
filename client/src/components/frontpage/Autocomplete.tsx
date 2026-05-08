import React, { useState, useEffect, useRef } from "react";
import { Input } from "../ui/Input";
import { Plus, Edit2 } from "lucide-react";

interface AutocompleteProps<T> {
  label: string;
  items: T[];
  onSearch: (query: string) => void;
  onSelect: (item: T | null) => void;
  onEdit?: (item: T) => void;
  onCreateNew: () => void;
  renderItem: (item: T) => React.ReactNode;
  placeholder?: string;
  value?: string; // Display value
  selectedItem?: T; // The actual selected object
}

const Autocomplete = <T,>({
  label,
  items,
  onSearch,
  onSelect,
  onEdit,
  onCreateNew,
  renderItem,
  placeholder,
  value,
  selectedItem,
}: AutocompleteProps<T>) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState(value || "");
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setSearchQuery(value || "");
  }, [value]);

  useEffect(() => {
    if (isOpen) {
        onSearch(searchQuery);
    }
  }, [searchQuery, isOpen, onSearch]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative w-full" ref={wrapperRef}>
      <label className="block text-sm font-medium text-zinc-700 mb-1">
        Select {label}
      </label>
      <div className="relative">
        <Input
          value={searchQuery}
          onChange={(e) => {
            const val = e.target.value;
            setSearchQuery(val);
            setIsOpen(true);
            if (val === "") {
              onSelect(null);
            }
          }}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          className="pr-10 "
        />
        {!selectedItem && (
          <button
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-zinc-400 hover:text-blue-600 transition-colors"
            onClick={(e) => {
              e.preventDefault();
              onCreateNew();
            }}
            type="button"
          >
            <Plus className="h-4 w-4 text-blue-600" />
          </button>
        )}
      </div>

      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-zinc-200 rounded-xl shadow-lg max-h-60 overflow-auto">
          <div className="flex">            
            {selectedItem && (<div
              className="border-t border-zinc-100 px-4 py-2 hover:bg-zinc-50 cursor-pointer text-blue-600 flex items-center gap-2 text-sm font-medium"
              onClick={() => {
                onEdit?.(selectedItem);
                setIsOpen(false);
              }}
            >
              <Edit2 className="h-4 w-4" />
              Edit {label}
            </div>)}

            <div
              className="border-t border-zinc-100 px-4 py-2 hover:bg-zinc-50 cursor-pointer text-blue-600 flex items-center gap-2 text-sm font-medium"
              onClick={() => {
                onCreateNew();
                setIsOpen(false);
              }}
            >
              <Plus className="h-4 w-4" />
              Add New {label}
            </div>

            {selectedItem && (<div
              className="border-t border-zinc-100 px-4 py-2 hover:bg-zinc-50 cursor-pointer text-red-600 flex items-center gap-2 text-sm font-medium"
              onClick={() => {
                onSelect(null);
                setIsOpen(false);
              }}
            >
              Clear
            </div> )}        
          </div>

          {items.length > 0 ? (
            items.slice(0, 10).map((item, index) => (
              <div
                key={index}
                className="px-4 py-2 hover:bg-zinc-50 cursor-pointer text-zinc-900 text-sm flex justify-between items-center group"
              >
                <div 
                  className="flex-1"
                  onClick={() => {
                    onSelect(item);
                    setIsOpen(false);
                  }}
                >
                  {renderItem(item)}
                </div>
                {onEdit && (
                  <button
                    className="p-1 text-zinc-400 hover:text-blue-600 transition-opacity"
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit(item);
                      setIsOpen(false);
                    }}
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                )}
              </div>
            ))
          ) : null}
        </div>
      )}
    </div>
  );
};

export default Autocomplete;

