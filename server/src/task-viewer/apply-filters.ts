import { Process } from "../types/process-types.js";


export function applyFilters(
  filters: string[] | null= null,
  system_process_array: Process[]
) {
  if (filters) {
    const [field, direction] = filters;
    if (direction === "asc") {
      if (field === "Name") {
        system_process_array.sort((a, b) => {
          const name = a.processName;
          const name2 = b.processName;
          return name < name2 ? -1 : 1;
        });
      } else {
        system_process_array.sort((a, b) => {
          return (a?.[field] as number) - (b?.[field] as number);
        });
      }
    } else {
      if (field === "Name") {
        system_process_array.sort((a, b) => {
          const name = a.processName;
          const name2 = b.processName;
          return name2 < name ? -1 : 1;
        });
      } else {
        system_process_array.sort((a, b) => {
          return (b?.[field] as number) - (a?.[field] as number);
        });
      }
    }
  }
}
