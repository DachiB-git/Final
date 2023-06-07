import { useEffect, useState } from "react";
import Product from "./Product";
import selectArrow from "./arrow.svg";
import logo from "./logo.svg";
import "./App.css";

function App() {
  const url = "https://api2.myauto.ge/ka/products";
  const [data, setData] = useState([]);
  const [curPage, setCurPage] = useState(1);
  const [query, setQuery] = useState("");
  const [formData, setFormData] = useState({
    ForRent: "",
    Mans: [],
    Cats: [],
    PriceFrom: "",
    PriceTo: "",
  });
  const [manData, setManData] = useState([]);
  const [catData, setCatData] = useState([]);
  useEffect(() => {
    fetch(`${url}?${query}&Page=${curPage}`)
      .then((res) => res.json())
      .then((res) => setData(res.data.items));
  }, [curPage, query]);
  useEffect(() => {
    fetch("https://static.my.ge/myauto/js/mans.json")
      .then((res) => res.json())
      .then((res) => setManData(res));
    fetch("https://api2.myauto.ge/ka/cats/get")
      .then((res) => res.json())
      .then((res) => setCatData(res.data));
  }, []);
  function nextPage() {
    setCurPage((prevPage) => prevPage + 1);
  }
  function handleSubmit(e: any) {
    e.preventDefault();
    const params: any = Object.entries(formData);
    function handleParam(param: string, i: number) {
      switch (param) {
        case "PriceFrom":
        case "PriceTo":
        case "ForRent":
          return params[i][1];
        case "Mans":
          return params[i][1].join("-");
        case "Cats":
          return params[i][1].join(".");
      }
    }

    let query_arr = [];
    for (let i = 0; i < params.length; i++) {
      query_arr.push(`${params[i][0]}=${handleParam(params[i][0], i)}`);
    }
    setQuery(query_arr.join("&"));
  }
  function handleFormChange(e: any) {
    switch (e.currentTarget.id) {
      case "deal":
        setFormData((prevFormData) => ({
          ...prevFormData,
          ForRent:
            prevFormData.ForRent === e.target.value ? "" : e.target.value,
        }));
        break;
      case "manufacturer":
        setFormData((prevFormData: any) => ({
          ...prevFormData,
          Mans: prevFormData.Mans?.includes(e.target.value)
            ? prevFormData.Mans.filter(
                (item: string) => item !== e.target.value
              )
            : [...(prevFormData.Mans ?? []), e.target.value],
        }));

        break;
      case "category":
        setFormData((prevFormData: any) => ({
          ...prevFormData,
          Cats: prevFormData.Cats?.includes(e.target.value)
            ? prevFormData.Cats.filter(
                (item: string) => item !== e.target.value
              )
            : [...(prevFormData.Cats ?? []), e.target.value],
        }));
        break;
      case "price":
        setFormData((prevFormData: any) => ({
          ...prevFormData,
          [`${e.target.id}`]: e.target.value,
        }));
    }
  }
  function showCheckboxes(e: any) {
    if (e.currentTarget.children[1].style.display === "flex") {
      e.currentTarget.children[1].style = "";
    } else {
      Array.from(document.querySelectorAll(".checkbox-container")).map(
        (container: any) => (container.style = "")
      );
      e.currentTarget.children[1].style = "display: flex";
      e.currentTarget.focus();
    }
  }
  function hideCheckboxes(e: any) {
    if (e.relatedTarget === null) {
      e.currentTarget.children[1].style = "";
    }
  }
  return (
    <div className="App">
      <header>
        <img src={logo} alt="Myauto Logo" />
      </header>
      <main>
        <button
          className="filter-btn-mobile"
          onClick={() => {
            const searchForm = document.getElementById("search-form");
            if (searchForm!.style.display === "") {
              searchForm!.style.display = "block";
            } else {
              searchForm!.style.display = "";
            }
          }}
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M2 4H7.5"
              stroke="#272A37"
              strokeWidth="1.4"
              strokeLinecap="round"
            ></path>
            <circle
              cx="10"
              cy="4"
              r="2.3"
              stroke="#272A37"
              strokeWidth="1.4"
            ></circle>
            <path
              d="M12 10L6.5 10"
              stroke="#272A37"
              strokeWidth="1.4"
              strokeLinecap="round"
            ></path>
            <circle
              cx="4"
              cy="10"
              r="2.3"
              transform="rotate(-180 4 10)"
              stroke="#272A37"
              strokeWidth="1.4"
            ></circle>
          </svg>
          ფილტრი
        </button>
        <form className="search-form" id="search-form" onSubmit={handleSubmit}>
          <p>გარიგების ტიპი</p>
          <div
            id="deal"
            onClick={showCheckboxes}
            onChange={handleFormChange}
            onBlur={hideCheckboxes}
            tabIndex={0}
            className="search-type-container"
          >
            <span
              className={`select-span ${formData.ForRent ? "selected" : ""}`}
            >
              {formData.ForRent
                ? document.querySelector(`label[for=deal-${formData.ForRent}]`)
                    ?.textContent
                : "ყველა გარიგება"}
              <img src={selectArrow} alt="Select Arrow" />
            </span>
            <div className="checkbox-container">
              <label htmlFor="deal-1">
                <input
                  type="checkbox"
                  value="1"
                  id="deal-1"
                  onChange={(e): any => {
                    const checkboxes: any =
                      e.target.parentNode?.parentNode?.querySelectorAll(
                        "input[type=checkbox]"
                      );
                    Array.from(checkboxes).map((input: any) =>
                      input === e.target ? input : (input.checked = false)
                    );
                  }}
                />
                იყიდება
              </label>
              <label htmlFor="deal-0">
                <input
                  type="checkbox"
                  value="0"
                  id="deal-0"
                  onChange={(e): any => {
                    const checkboxes: any =
                      e.target.parentNode?.parentNode?.querySelectorAll(
                        "input[type=checkbox]"
                      );
                    Array.from(checkboxes).map((input: any) =>
                      input === e.target ? input : (input.checked = false)
                    );
                  }}
                />
                ქირავდება
              </label>
            </div>
          </div>
          <p>მწარმოებელი</p>
          <div
            id="manufacturer"
            onClick={showCheckboxes}
            onBlur={hideCheckboxes}
            onChange={handleFormChange}
            tabIndex={0}
            className="search-type-container"
          >
            <span
              className={`select-span ${
                formData.Mans.length ? "selected" : ""
              }`}
            >
              {formData?.Mans.length !== 0
                ? formData?.Mans.map(
                    (item: any) =>
                      document.querySelector(`label[for=man-${item}]`)
                        ?.textContent
                  ).join(", ")
                : "ყველა მწარმოებელი"}
              <img src={selectArrow} alt="Select Arrow" />
            </span>
            <div className="checkbox-container" onChange={handleFormChange}>
              {manData.map((man: any) => (
                <label key={man.man_id} htmlFor={`man-${man.man_id}`}>
                  <input
                    type="checkbox"
                    value={man.man_id}
                    id={`man-${man.man_id}`}
                  />
                  {man.man_name}
                </label>
              ))}
            </div>
          </div>
          <p>კატეგორია</p>
          <div
            id="category"
            onClick={showCheckboxes}
            onBlur={hideCheckboxes}
            onChange={handleFormChange}
            tabIndex={0}
            className="search-type-container"
          >
            <span
              className={`select-span ${
                formData.Cats.length ? "selected" : ""
              }`}
            >
              {formData?.Cats.length !== 0
                ? formData?.Cats.map(
                    (item: any) =>
                      document.querySelector(`label[for=cat-${item}]`)
                        ?.textContent
                  ).join(", ")
                : "ყველა კატეგორია"}
              <img src={selectArrow} alt="Select Arrow" />
            </span>
            <div className="checkbox-container">
              {catData.map((cat: any) => (
                <label key={cat.category_id} htmlFor={`cat-${cat.category_id}`}>
                  <input
                    type="checkbox"
                    value={cat.category_id}
                    id={`cat-${cat.category_id}`}
                  />
                  {cat.title}
                </label>
              ))}
            </div>
          </div>
          <p>ფასი</p>
          <div id="price" onChange={handleFormChange}>
            <input
              type="number"
              min={0}
              step={1}
              placeholder="დან"
              id="PriceFrom"
            ></input>
            <input
              type="number"
              min={0}
              step={1}
              placeholder="მდე"
              id="PriceTo"
            ></input>
          </div>
          <input type="submit" value="ძებნა" />
        </form>
        <div className="product-list-container">
          {data.map((car: any, i) => (
            <Product
              key={i}
              {...car}
              man_name={
                manData.find((item: any) => item.man_id === car.man_id + "")?.[
                  "man_name"
                ]
              }
              category_name={
                catData.find(
                  (item: any) => item.category_id === car.category_id
                )?.["title"]
              }
            />
          ))}
        </div>
        <select>
          <option value="">პერიოდი</option>
          <option value="1h">ბოლო 1 საათი</option>
          <option value="2h">ბოლო 2 საათი</option>
          <option value="3h">ბოლო 3 საათი</option>
          <option value="1d">ბოლო 1 დღე</option>
          <option value="2d">ბოლო 2 დღე</option>
          <option value="3d">ბოლო 3 დღე</option>
          <option value="1w">ბოლო 1 კვირა</option>
          <option value="2w">ბოლო 2 კვირა</option>
          <option value="3w">ბოლო 3 კვირა</option>
        </select>
        <h2>{curPage}</h2>
        <button onClick={nextPage}>Next Page</button>
      </main>
    </div>
  );
}

export default App;
