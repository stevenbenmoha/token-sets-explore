// src/App.js

import React, {Component} from 'react';
import Set from "set.js";
import {
    basicIssuanceModuleAddress,
    controllerAddress,
    debtIssuanceModuleAddress,
    governanceModuleAddress,
    masterOracleAddress,
    navIssuanceModuleAddress,
    protocolViewerAddress,
    setTokenCreatorAddress,
    streamingFeeModuleAddress,
    tradeModuleAddress
} from "./constants/ethContractAddresses";
import {infuraMainnetUrl} from "./constants/web3Providers";
import {defiPulseAddress, layerTwoAddress, metaverseAddress} from "./constants/tokens";
import {DisplaySet, Position} from "./classes/DisplaySet";
import SetList from "./components/SetList";
import tokenList from "./constants/ethereum.tokenlist.json"
import {Box, Card, CardContent} from '@mui/material';

const Web3 = require('web3');

class App extends Component {

    web3: any;
    mainConfig: any;
    setToken: any;
    myAddress = '0xA817fDf9b769D2E74D12e8e28294eFa2c331B799';
    tokenSets = [defiPulseAddress, metaverseAddress, layerTwoAddress];
    displayedSets: DisplaySet[] = [];
    showSets = false;

    state = {
        setList: this.displayedSets
    }

    render() {
        if (this.showSets) {
            return (
                <div>
                    <Card className="rounded-border card" elevation={20}>
                        <CardContent className="unified-style card-header">
                            <img src="https://www.tokensets.com/static/media/set-and-tokensets-logo.872a2884.svg" className="graphik-font page-title"/>
                        </CardContent>
                    </Card>
                    <Box sx={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        '& > :not(style)': {
                            m: 3,
                            width: 400
                        },
                        justifyContent: 'center'
                    }}>
                        <br/>
                        <SetList setList={new DisplaySet(this.displayedSets[0].name, this.displayedSets[0].symbol, this.displayedSets[0].address, this.displayedSets[0].currentPositions)}/>
                        <SetList setList={new DisplaySet(this.displayedSets[1].name, this.displayedSets[1].symbol, this.displayedSets[1].address, this.displayedSets[1].currentPositions)}/>
                        <SetList setList={new DisplaySet(this.displayedSets[2].name, this.displayedSets[2].symbol, this.displayedSets[2].address, this.displayedSets[2].currentPositions)}/>
                    </Box>
                </div>
            );
        } else {
            return (
                <div> Loading ... </div>
            );
        }
    }

    async componentDidMount() {
        await this.instantiateSetToken();
        await this.mapSetDetailsToDisplaySets();
        await this.setChildState();
    }

    private async instantiateSetToken() {
        this.web3 = new Web3(infuraMainnetUrl);
        this.mainConfig = {
            web3Provider: this.web3.currentProvider,
            basicIssuanceModuleAddress: basicIssuanceModuleAddress,
            controllerAddress: controllerAddress,
            masterOracleAddress: masterOracleAddress,
            navIssuanceModuleAddress: navIssuanceModuleAddress,
            protocolViewerAddress: protocolViewerAddress,
            setTokenCreatorAddress: setTokenCreatorAddress,
            streamingFeeModuleAddress: streamingFeeModuleAddress,
            tradeModuleAddress: tradeModuleAddress,
            debtIssuanceModuleAddress: debtIssuanceModuleAddress,
            debtIssuanceModuleV2Address: debtIssuanceModuleAddress,
            governanceModuleAddress: governanceModuleAddress
        }
        this.setToken = new Set(this.mainConfig).setToken;
    }

    private async mapSetDetailsToDisplaySets() {
        for (const set of this.tokenSets) {

            await this.fetchSetDetails(set, this.myAddress).then(async res => {
                const positionAddresses: string[] = [];
                res.positions.forEach((pos: string[]) => {
                    positionAddresses.push(pos[0]);
                })
                const positionsObj = await this.fetchTokenPositionList(positionAddresses);
                this.displayedSets.push(new DisplaySet(res.name, res.symbol, set, positionsObj));
            });
        }
        console.log("finished mapping -> ", this.displayedSets);
    }

    private async setChildState() {
        await this.setState({setList: this.displayedSets});
        this.showSets = true;
        await this.forceUpdate();
    }

    private async fetchSetDetails(setAddress: string, callerAddress: string): Promise<any> {
        if (this.setToken) {
            const modules = await this.setToken.getModulesAsync(setAddress, callerAddress);
            return await this.setToken.fetchSetDetailsAsync(setAddress, modules, callerAddress);
        }
    }

    private async fetchTokenPositionList(positions: string[]) {

        const fullPositionList: any[] = [];

        // For each address, fetch the name and logo from a hashmap created from json file of coingecko tokens
        for (const address of positions) {
            const array = tokenList.tokens;
            const result = new Map<String, String>(array.map(obj => [obj.address.toLowerCase(), obj.name + '^' + obj.logoURI]));
            let mapEntryPosition = result.get(address.toLowerCase());

            if (mapEntryPosition) {
                //  To avoid complex multi-value map, both name and logo stored in value. extracted below:
                const name = mapEntryPosition.split('^')[0];
                const logoURI = mapEntryPosition.split('^')[1];
                fullPositionList.push(new Position(name, address.toLowerCase(), logoURI));
            }
        }
        return fullPositionList;
    }
}

export default App;
