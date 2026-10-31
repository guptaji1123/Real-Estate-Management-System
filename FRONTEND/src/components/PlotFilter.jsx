function PlotFilter({
  search,
  setSearch,
  statusFilter,
  setStatusFilter,
  maxPrice,
  setMaxPrice
}) {

  function clearFilters() {
    setSearch("");
    setStatusFilter("ALL");
    setMaxPrice("");
  }

  return (
    <div className="panel form">

      <h2>Search and Filter Plots</h2>

      <div className="form-grid">

        <label>
          Search Plot Number
          <input
            type="text"
            placeholder="Enter plot number"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </label>

        <label>
          Plot Status
          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
          >
            <option value="ALL">All Status</option>
            <option value="AVAILABLE">Available</option>
            <option value="BOOKED">Booked</option>
            <option value="SOLD">Sold</option>
          </select>
        </label>

        <label>
          Maximum Price (₹)
          <input
            type="number"
            min="0"
            placeholder="Maximum price"
            value={maxPrice}
            onChange={(event) => setMaxPrice(event.target.value)}
          />
        </label>

      </div>

      <button
        type="button"
        className="outline"
        onClick={clearFilters}
      >
        Clear Filters
      </button>

    </div>
  );
}

export default PlotFilter;