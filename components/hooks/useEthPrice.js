import useSWR from "swr"

const URL = "https://api.coingecko.com/api/v3/coins/ethereum?localization=false&tickers=false&community_data=false&developer_data=false&sparkline=false"
export const COURSE_PRICE = 1000

const fetcher = async url => {
  const res = await fetch(url)
  const json = await res.json()
  return json.market_data.current_price.inr ?? null
}

export const useEthPrice = () => {
  const {data, ...rest} = useSWR(
    URL,
    fetcher,
    { refreshInterval: 10000 }
  )

  const perItem = (data && (COURSE_PRICE / Number(data)).toFixed(6)) ?? null
  return { eth: { data, perItem, ...rest}}
}


//api used to retrieve information about the 
//current price of ether
//URL is used here as identifier for useSWR
