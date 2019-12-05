/*
 * The MIT License (MIT)
 *
 * Copyright (c) 2019 Looker Data Sciences, Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

import React from 'react'
import {ILook} from '@looker/sdk'
import {
  TableDataCell,
  Heading,
  Text,
  Box,
  TableHead,
  TableBody,
  Table,
  TableRow,
  TableHeaderCell
} from '@looker/components'
import PollsViz from './PollsViz'

export interface QueryProps {
  look?: ILook
  results?: string
  running: boolean
}

export interface Field {
  name: string
  label: string
}

export interface Survey {
  start: string
  end: string
  pollster: string
  state: string
  grade: string
  population: string
  biden: number
  warren: number
  sanders: number
  buttigieg: number
  harris: number
  gabbard: number
  yang: number
  booker: number
  bloomberg: number
  steyer: number
  klobuchar: number
}
const parse = (results?: any): Survey[] => {
  //console.log(results);
  results = JSON.parse(results);
  //console.log(results)

  // FETCH DIMENSION NAMES AND LABELS
  let dimensions : Field[] = [];
  results[`fields`]['dimensions'].forEach( function(d: any) {
    let field = {} as Field;
    field.name = d['name'];
    field.label = d['label_short'] ? d['label_short'] : d['label'];
    dimensions.push(field);
  });
  //console.log(dimensions)

  // FETCH MEASURE NAMES AND LABELS
  let measures : Field[] = [];
  results['fields']['measures'].forEach( function(d: any) {
    let field = {} as Field;
    field.name = d['name'];
    field.label = d['label_short'] ? d['label_short'] : d['label'];
    measures.push(field);
  });

  let data : Survey[] = [];
  results['data'].forEach( function(d: any, index: any) {
    let poll = {} as Survey;
    poll.start = d[dimensions[0].name].value;
    poll.end = d[dimensions[1].name].value;
    poll.pollster = d[dimensions[2].name].value.substring(0,20);
    poll.state = d[dimensions[3].name].value;
    poll.grade = d[dimensions[4].name].value;
    poll.population = d[dimensions[5].name].value;
    poll.biden = Math.round(d[measures[0].name].value*10) / 10;
    poll.warren = Math.round(d[measures[1].name].value*10) / 10;
    poll.sanders = Math.round(d[measures[2].name].value*10) / 10;
    poll.buttigieg = Math.round(d[measures[3].name].value*10) / 10;
    poll.harris = Math.round(d[measures[4].name].value*10) / 10;
    poll.steyer = Math.round(d[measures[5].name].value*10) / 10;
    poll.bloomberg = Math.round(d[measures[6].name].value*10) / 10;
    poll.klobuchar = Math.round(d[measures[7].name].value*10) / 10;
    poll.yang = Math.round(d[measures[8].name].value*10) / 10;
    poll.gabbard = Math.round(d[measures[9].name].value*10) / 10;
    poll.booker = Math.round(d[measures[10].name].value*10) / 10;
    data.push(poll);
  });
  return data;
}

const headings = (results?: any): Array<String> => {
  if (!results || !results.length || results.length === 0) {
    return []
  }
  let data: Survey[] = parse(results);
  //console.log(data);
  return Object.keys(data[0]).map((key: any) => key)
}

const values = (results?: any): Survey[] => {
  if (!results || !results.length || results.length === 0) {
    return []
  }
  // PARSE DATA OBJECT FOR DIMENSIONS AND MEASURES TO BE FORMATTED IN SIMPLE ARRAY
  let data : Survey[] = parse(results);
  //console.log(data);
  return data;
}

export const QueryContainer: React.FC<QueryProps> = ({look, results, running}) => (
  <Box m='small' width='100%'>
      <PollsViz data={values(results)} width={120} height={50} />
  </Box>
)

      // <Table>
      //   <TableHead>
      //     <TableRow>
      //       {headings(results).map((heading, index) => (
      //         <TableHeaderCell key={index}>{heading}</TableHeaderCell>
      //       ))}
      //     </TableRow>
      //   </TableHead>
      //   <TableBody>
      //     {values(results)
      //       .map((row: any, rowIndex) => (
      //         <TableRow key={rowIndex}>
      //           {Object.keys(row).map((column: any, columnIndex) => (
      //             <TableDataCell key={`${rowIndex}-${columnIndex}`}>{row[column]}</TableDataCell>
      //           ))}
      //         </TableRow>
      //       ))}
      //   </TableBody>
      // </Table>