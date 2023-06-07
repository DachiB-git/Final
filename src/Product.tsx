import { useEffect, useState } from "react";

function Product(props: any) {
  const {
    man_id,
    model_id,
    photo,
    car_id,
    car_model,
    photo_ver,
    prod_year,
    man_name,
    price_value,
    views,
    category_name,
    car_run_km,
  } = props;
  const [data, setData] = useState(null);
  useEffect(() => {
    fetch(`https://api2.myauto.ge/ka/getManModels?man_id=${man_id}`)
      .then((res) => res.json())
      .then((res) => {
        setData(res.data.find((item: any) => item.model_id === model_id));
      });
  }, [man_id, model_id]);
  function getName() {
    return (
      <p className="product-title">
        {`${man_name} ${data?.["model_name"]} ${car_model} `}
        <span className="year-span">{prod_year} წ</span>
      </p>
    );
  }
  function newPrice(price: string): string {
    let new_price: string = "";
    let i: number = 3;
    while (i < price.length) {
      new_price =
        "," + price.slice(price.length - i, price.length - i + 3) + new_price;
      i += 3;
    }
    return price.slice(0, price.length - (i - 3)) + new_price;
  }
  return (
    <div className="product-wrapper">
      <div
        className="product-photo"
        style={{
          backgroundImage: `url(https://static.my.ge/myauto/photos/${photo}/thumbs/${car_id}_1.jpg?v=${photo_ver})`,
        }}
      ></div>
      {data && getName()}
      <p className="product-price">
        {String(price_value).length > 3
          ? newPrice(String(price_value))
          : price_value}
      </p>
      <div className="product-specs">
        <p className="product-mileage">{car_run_km} კმ</p>
        <p className="product-category">{category_name}</p>
      </div>
      <div className="product-info">
        <p className="product-views">{views} ნახვა</p>
      </div>
    </div>
  );
}

export default Product;
