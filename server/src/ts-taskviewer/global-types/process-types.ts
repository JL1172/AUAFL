export interface ProcessObj {
  Name: string;
  Pid: string;
  VmPeak: string;
  VmRSS: string;
  RssAnon: string;
  Threads: string;
  VmSize: string;
  VmSwap: string;
  cpuUtilization: number;
  memoryUtilization: number;
  rawCpuTime: { utime: number; stime: number; timestamp: number };
}

export interface Process {
  [key: string]: ProcessObj[] | number | boolean | string;
  memory: number;
  currSwap: number;
  currRam: number;
  memPeakAverage: number;
  averageCpuTime: number;
  displayCpuTime: boolean;
  averageThreads: number;
  processName:string;
}