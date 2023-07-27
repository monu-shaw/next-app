// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import axios from "axios";
import { NextResponse as res } from "next/server";



export const GET= async(req) => {
  // Open Chrome DevTools to step through the debugger!
  // debugger;
  let products = await axios('https://fakestoreapi.com/products/1').then(r=>r.data)
  return res.json({ name: 'Hello, world!',products },{status:200});
};
