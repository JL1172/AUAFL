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
  }
  
  export interface Process {
    [key: string]: ProcessObj[] | number | boolean | string;
    memory: number;
    currSwap: number;
    currRam: number;
    PidToDisplay: number;
    memPeakAverage: number;
    averageCpuTime: number;
    displayCpuTime: boolean;
    averageThreads: number;
    processName: string;
  }