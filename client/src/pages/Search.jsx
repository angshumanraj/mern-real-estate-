export const Search = () => {
    return (
      <div className="flex flex-col md:flex-row">
        <div className="p-7 border-b-2 md:border-r-2 md:min-h-screen">
          <form className="flex flex-col">
            <div className="flex items-center gap-2 mb-4">
              <label htmlFor="searchterm" className="whitespace-nowrap font-semibold">SearchTerm</label>
              <input
                type="text"
                id="searchterm"
                placeholder="Search.."
                className="border rounded-lg p-3 w-full"
              />
            </div>
            <div className="flex gap-2 flex-wrap items-center mb-4">
              <label>Type:</label>
              <div className="flex gap-2 items-center">
                <input type="checkbox" id="all" className="w-5" />
                <span>Rent & Sale</span>
              </div>
              <div className="flex gap-2 items-center">
                <input type="checkbox" id="rent" className="w-5" />
                <span>Rent</span>
              </div>
              <div className="flex gap-2 items-center">
                <input type="checkbox" id="sale" className="w-5" />
                <span>Sale</span>
              </div>
              <div className="flex gap-2 items-center">
                <input type="checkbox" id="offer" className="w-5" />
                <span>Offer</span>
              </div>
            </div>
            <div className="flex gap-2 flex-wrap items-center mb-4">
              <label>Ammenities:</label>
              <div className="flex gap-2 items-center">
                <input type="checkbox" id="parking" className="w-5" />
                <span>Parking</span>
              </div>
              <div className="flex gap-2 items-center">
                <input type="checkbox" id="furnished" className="w-5" />
                <span>Furnished</span>
              </div>
            </div>
            <div className="flex items-center gap-2 mb-4">
              <label htmlFor="sort_order">Sort:</label>
              <select id="sort_order" className="border rounded-lg p-3">
                <option>Price high to low</option>
                <option>Price low to high</option>
                <option>Oldest</option>
                <option>Latest</option>
              </select>
            </div>
            <button className='bg-orange-500 text-white rounded-lg uppercase hover:opacity-95 p-3'>Search</button>
          </form>
        </div>
        <div className="">
          <h1 className="text-3xl font-semibold border-b p-3 text-slate-700 mt-5">Listing result:</h1>
        </div>
      </div>
    );
  };
  