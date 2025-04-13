import { Process, ProcessObj } from "../types/process-types.js";

export function calculateCpuUtilization(
  clockTickRate: number,
  display_cpu_utilization_flag: boolean,
  previous_process_arr: Process[] = [],
  idx_tracker: number,
  system_process_array: Process[],
  pollingInterval: number
) {
  if (
    display_cpu_utilization_flag === true &&
    previous_process_arr?.length > 0
  ) {
    const len = idx_tracker;
    for (let i = 0; i < len; i++) {
      const curr_proc: Process = system_process_array[i];
      const name_of_proc: string = curr_proc.processName;

      if (!name_of_proc) continue;

      const previous_proc: Process | undefined = previous_process_arr?.find(
        (proc) => name_of_proc in proc
      );
      if (!previous_proc) continue;

      const current_processses: ProcessObj[] = curr_proc[
        name_of_proc
      ] as ProcessObj[];
      const previous_processes: ProcessObj[] = previous_proc[
        name_of_proc
      ] as ProcessObj[];

      const curr_proc_len: number = current_processses?.length;

      let total_cpu_utilization = 0;

      for (let j = 0; j < curr_proc_len; j++) {
        const curr_sub_proc: ProcessObj = current_processses[j];
        const prev_matching_sub_proc: ProcessObj | undefined = previous_processes.find(
          (old_proc) => old_proc.Pid === curr_sub_proc.Pid
        );
        /**
                This is the meat of the calculation
                I am computing the cpu utilization percentage per matching process
                this equation is 
    
                if 
                x = current process stime 
                and 
                y = current process utime 
                and
                o = current timestamp
    
                and 
                z = previous process stime 
                and 
                a = previous process utime 
                and 
                p = previous timestamp
    
                c = clock tick rate of computer defaults to 100
    
                d = difference between o and p;
                
    
                cpu utilization = (((x + y) - (z - a)) / (d * c)) * 100
              */
        if (
          prev_matching_sub_proc &&
          prev_matching_sub_proc?.rawCpuTime &&
          curr_sub_proc?.rawCpuTime
        ) {
          const time_difference =
            (curr_sub_proc.rawCpuTime.timestamp -
              prev_matching_sub_proc.rawCpuTime.timestamp) /
            pollingInterval;

          if (time_difference <= 0) continue;

          const prev_total =
            prev_matching_sub_proc.rawCpuTime.utime +
            prev_matching_sub_proc.rawCpuTime.stime;

          const curr_total =
            curr_sub_proc.rawCpuTime.utime + curr_sub_proc.rawCpuTime.stime;

          const cpu_time_diff = curr_total - prev_total;

          const utilization_percentage =
            (cpu_time_diff / (clockTickRate * time_difference)) * 100;

            total_cpu_utilization += utilization_percentage;
          curr_sub_proc.cpuUtilization = Math.max(0, utilization_percentage);
          curr_proc.totalCpuUtilization = total_cpu_utilization;
        }
      }
      curr_proc.displayCpuTime = true;
    }
  }
}
