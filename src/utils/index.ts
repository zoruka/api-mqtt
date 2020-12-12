export const log = (title: string, ...data: any): void => {
  console.log(`[${new Date().toLocaleTimeString()}][${title}]`, ...data);
};
