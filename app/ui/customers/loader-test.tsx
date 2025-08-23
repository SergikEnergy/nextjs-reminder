const sleepSync = (limit: number) => {
  console.log('start');
  let startDate = Date.now();
  const endDate = startDate + limit;
  while (endDate >= startDate) {
    startDate = Date.now();
  }
  console.log('stop');
};

export const LoaderTest = () => {
  sleepSync(2000);

  return <p>Customers</p>;
};
