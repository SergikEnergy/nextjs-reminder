import { Suspense } from 'react';
import Loading from './loading';
import { LoaderTest } from '@/app/ui/customers/loader-test';

const Page = () => {
  return (
    <Suspense fallback={<Loading />}>
      <LoaderTest />
    </Suspense>
  );
};

export default Page;
