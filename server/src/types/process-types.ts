export interface rawCpuTimeObj {
    utime: number;
    stime: number;
    timestamp: number;
  }
  export interface ProcessObj {
    Name: string;
    Pid: number;
    VmPeak: number;
    VmRSS: number;
    Threads: number;
    VmSize: number;
    VmSwap: number;
    cpuUtilization: number;
    memoryUtilization: number;
    rawCpuTime: rawCpuTimeObj | null;
    isSystemProcess: boolean;
    Uid: string;
  }
  
  export interface Process {
    [key: string]: ProcessObj[] | number | boolean | string;
    totalMemoryUtilization: number;
    totalSwap: number;
    totalVmRSS: number;
    PidToDisplay: number;
    totalVmPeak: number;
    totalCpuUtilization: number;
    displayCpuTime: boolean;
    totalThreads: number;
    processName: string;
    isSystemProcess: boolean;
  }