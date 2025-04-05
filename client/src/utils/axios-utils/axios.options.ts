interface ProcessObj {
    Name: string;
    Pid: string;
    VmPeak: string;
    VmRSS: string;
    RssAnon: string;
    Threads: string;
    VmSize: string;
    VmSwap: string;
    cpuUtilization: number;
    memoryUtilization: string;
  }
  interface Process {
    [key: string]: ProcessObj | number | boolean;
    memory: number;
    currSwap: number;
    currRam: number;
    memPeakAverage: number;
    averageCpuTime: number;
    displayCpuTime: boolean;
  }


interface AxiosOptions {
    task_viewer: {route:"/processes", method:'post', reqBodyInterface: Process[] | null},
    general_info: {route:"/general-info", method:'get'}
}


export const axiosOptions: AxiosOptions = {
    task_viewer: {route: "/processes", method: 'post', reqBodyInterface: null},
    general_info: {route: "/general-info", method: 'get'}
}