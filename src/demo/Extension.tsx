/*
 * The MIT License (MIT)
 *
 * Copyright (c) 2019 Looker Data Sciences, Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the  is
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
import {QueryContainer} from './QueryContainer';
import {LookList} from './LookList'
import {Banner, Box, Heading, Flex} from '@looker/components'
import {ExtensionContext} from '@looker/extension-sdk-react'
import {ILook} from '@looker/sdk'
import {Switch, Route, RouteComponentProps, withRouter, MemoryRouter} from 'react-router-dom'
import ReactDOM from 'react-dom'

interface ExtensionState {
  queryResult?: any
  runningQuery: boolean
  errorMessage?: string
}


class ExtensionInternal extends React.Component<RouteComponentProps, ExtensionState> {
  static contextType = ExtensionContext
  context!: React.ContextType<typeof ExtensionContext>

  constructor(props: RouteComponentProps) {
    super(props)
    this.state = {
      queryResult: undefined,
      runningQuery: false
    }
  }

  componentDidMount() {
    const {initializeError} = this.context
    if (initializeError) {
      return
    }
    this.runQuery()
  }

  componentDidUpdate() {
    const {initializeError} = this.context
    if (initializeError) {
      return
    }
  }

  // TEMPLATE CODE FOR RUNNING ANY QUERY 
  async runQuery() {
      try {
      const result = await this.context.coreSDK.ok(
        this.context.coreSDK.run_inline_query({
          result_format: "json_detail",
          //limit: 50,
          body: {
            model: "pollooker",
            view: "primary",
            fields: ["primary.start_date_date", "primary.end_date_date",  "primary.pollster",  "primary.state",  "primary.fte_grade",  "primary.pool", "primary.biden_polling_pct", "primary.warren_polling_pct", "primary.sanders_polling_pct", "primary.buttigieg_polling_pct", "primary.harris_polling_pct", "primary.steyer_polling_pct", "primary.bloomberg_polling_pct", "primary.klobuchar_polling_pct", "primary.yang_polling_pct", "primary.gabbard_polling_pct", "primary.booker_polling_pct"],
            //filter_expression: "${primary.party} = \"DEM\" AND ${primary.state} = \"Iowa\" OR ${primary.state} = \"South Carolina\" OR ${primary.state} = \"New Hampshire\" OR ${primary.state} = \"Nevada\"",
            filter_expression: "${primary.party} = \"DEM\" AND ${primary.state} = \"\"",
            sorts: [`start_date_date desc`]
          }
        })
      )
      this.setState({
        queryResult: JSON.stringify(result, undefined, 2),
        runningQuery: false
      })
    } catch (error) {
      this.setState({
        queryResult: "",
        runningQuery: false,
        errorMessage: "Unable to run query"
      })
    }
  }

  render() {
    if (this.context.initializeError) {
      return <Banner intent='error'>{this.context.initializeError}</Banner>
    }
    return (
      <>
        {this.state.errorMessage && <Banner intent='error'>{this.state.errorMessage}</Banner>}
        <Box m='large' id='boxID'>
          <Heading fontWeight='semiBold'>Pollooker</Heading>
          <Heading fontWeight='light'>Tracking the 2020 Democratic Primary</Heading>
          <Flex width='100%'>
            <Switch>
              <Route path='/app'>
                <QueryContainer
                  results={this.state.queryResult}
                  running={this.state.runningQuery}
                />
              </Route>
            </Switch>
          </Flex>
        </Box>
      </>
    )
  }
}

export const Extension = withRouter(ExtensionInternal)
