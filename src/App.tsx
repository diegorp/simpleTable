import groceryItems from './data/groceryItems';
import Table from './components/Table';

function App() {
  return (
    <main className='flex flex-col h-screen w-screen p-20'>
      <Table
        title="Today's groceries"
        data={groceryItems}
        rowIdKey='id'
        pagination
        sort
        hideRowId
        filter
      />
    </main>
  );
}

export default App;
