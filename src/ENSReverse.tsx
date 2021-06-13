import React, { useState } from 'react'
import Web3 from 'web3'
// To replace window.ethereum:
// import { initProvider } from '@metamask/inpage-provider'
// import * as LocalMessageDuplexStream from 'post-message-stream'
import MetamaskOnboarding from '@metamask/onboarding'
import {
  Stack, Input, Container, Flex, UnorderedList, ListItem,
  Button, Text, Box, Grid,
} from '@chakra-ui/react'
import { AbiItem } from 'web3-utils'
import { Contract } from 'web3-eth-contract'
import { abi as resolverABI } from '@ensdomains/ens-contracts/artifacts/contracts/resolvers/Resolver.sol/Resolver.json'
import {
  ensABI, registrarABI, reverseRegistrarABI,
} from './abi'
import { useEffect } from 'react'

declare global {
  interface Window {
    ethereum: any
  }
}
const { ethereum } = window
const web3 = new Web3(ethereum)

const logger = (css: string) => (
  (...args: unknown[]) => {
    args[0] = `%c ${args[0]} `
    args.splice(1, 0, css)
    console.log.apply(this, args)
  }
)

const namehash = (name: string) => {
  let node = `0x${'0'.repeat(64)}`
  if(name !== '') {
    const labels = name.split('.')
    for(let i = labels.length - 1; i >= 0; i--) {
      node = (
        web3.utils.sha3(
          node + (web3.utils.sha3(labels[i]) ?? '').slice(2)
        )
        ?? ''
      )
    }
  }
  return node.toString()
}

const NET: Record<string, Record<string, string>> = {
  Ropsten: {
    ens: '0x112234455c3a32fd11230c42e7bccd4a84e02010',
    resolve: '0x4c641fb9bad9b60ef180c31f56051ce826d21a9a',
  },
  mainnet: {
    ens: '0x314159265dd8dbb310642f98f50c066173c1259b',
    resolve: '0xe7410170f87102df0055eb195163a03b7f2bff4a',
  },
  Rinkeby: {
    ens: '0xe7410170f87102df0055eb195163a03b7f2bff4a'
  },
}

interface Addresses extends Partial<Record<string, string>> {
  self?: string
  owner?: string
  rev?: string
  net?: string
  resolver?: string
  ens?: string
  resolve?: string
  revOwn?: string
}

interface Contracts {
  revRes?: Contract
  ens?: Contract
  reg?: Contract
  revReg?: Contract
}

// eslint-disable-next-line import/no-anonymous-default-export
export default () => {
  const onboarding = new MetamaskOnboarding()
  const [name, setName] = useState('dhappy')
  const [tld, setTLD] = useState('eth')
  const [titles, setTitles] = useState({
    self: 'Your Address',
    net: 'Current Network',
    rev: 'Reverse Address',
    ens: 'ENS Address',
    reg: 'Registrar Address',
    revReg: 'Reverse Registrar Address',
    owner: `${name}.${tld} Owner`,
    revOwn: `Reverse Lookup Owner`,
    resolve: 'Resolver Address',
    revLook: 'Reverse Lookup',
  })
  const [addrs, setAddrs] = useState<Addresses>({})
  const [tracts, setTracts] = useState<Contracts>({})

  const updateAddr = (key: string, val: string) => {
    setAddrs(as => ({ ...as, [key]: val }))
  }

  const netSet = () => {
    const net = (() => {
      switch(parseInt(ethereum.networkVersion)) {
        case 1: return 'mainnet'
        case 2: return 'Morden'
        case 3: return 'Ropsten'
        case 4: return 'Rinkeby'
        case 42: return 'Kovan'
        case 100: return 'xDAI'
        default: return `unknown (id:${ethereum.networkVersion})`
      }
    })()
    updateAddr('net', net)
    console.log(Object.assign({}, NET[net]))
    setAddrs(as => Object.assign({}, as, NET[net]))
  }
  ethereum.on('networkChanged', () => {
    setAddrs({})
    setTracts({})
  })
  ethereum.on('accountsChanged', (accts: string[]) => (
    updateAddr('self', accts[0])
  ))

  useEffect(() => {
    setTitles((ts) => (
      { ...ts, owner: `${name}.${tld} Owner` }
    ))
  }, [name, tld])

  const handlers = [
    {
      name: 'Install MetaMask',
      func: () => onboarding.startOnboarding(),
      if: () => !MetamaskOnboarding.isMetaMaskInstalled(),
    },
    {
      name: 'Stop Onboarding',
      func: () => { try {
        onboarding.stopOnboarding()
      } catch(err) {
        console.warn(err)
      } },
      if: () => !MetamaskOnboarding.isMetaMaskInstalled(),
    },
    {
      name: 'Enable Ethereum on this Site',
      func: async () => {
        const log = logger('color: purple')
        log('Enabling Inpage Provider')
        const addr = (await ethereum.enable())[0]
        updateAddr('self', addr)
        log('Wallet Address', addr)
      },
      if: () => (!addrs.self),
    },
    {
      name: 'Load Addresses',
      func: async () => {
        const log = logger('color: orange; background-color: purple')

        log('Setting addrs.net')
        netSet()

        log('Adding Reverse Address')
        updateAddr(
          'rev',
          `${(addrs.self ?? '').substr(2)}.addr.reverse`
        )
      },
      if: () => !!addrs.self && !addrs.net,
    },
    {
      name: 'Load Contracts',
      func: async () => {
        const log = logger('color: lightgray; background-color: black')

        log('Looking Up Owner of resolver.eth')
        const resolverAddress = (
          await web3.eth.ens.getAddress('resolver.eth')
        )
        updateAddr('resolver', resolverAddress)
        log('Owner', resolverAddress)

        const publicResolver = new web3.eth.Contract(
          resolverABI as AbiItem[], resolverAddress
        )
        let name = await (
          publicResolver.methods.name(namehash(addrs.rev ?? ''))
          .call()
        )
        log('name', name, addrs.rev)
        // updateAddr('revLook', name)

        // log(`Looking Up Owner of ${tld}`)
        // const registrarAddress = await ens.methods.owner(namehash(tld)).call()
        // updateAddr('reg', registrarAddress)
        // log('Owner', registrarAddress)
  
        // log('Creating ENS and Regisrtar Contracts')
        // const registrar = new web3.eth.Contract(registrarAbi, registrarAddress)
        // log('Contracts Completed', `ens:${ens}`, `reg:${registrar}`)
  
        // log(`Looking Up Owner of addr.reverse`)
        // const reverseRegistarAddr = await ens.methods.owner(namehash('addr.reverse')).call()
        // updateAddr('revReg', reverseRegistarAddr)
        // log('Owner', reverseRegistarAddr)
  
        // log(`Creating a Reverse Resolver (${addrs.rev})`)
        // const reverseResolverAddr = await ens.methods.resolver(namehash(addrs.rev)).call()
        // log(reverseResolverAddr) // null
        // const reverseResolver = new web3.eth.Contract(publicResolverAbi, reverseResolverAddr)
        // // let name = await reverseResolver.methods.name(namehash(addrs.rev)).call()
        // // updateAddr('revLook', name)
        // // console.log('Got Reverse Lookup', name)
  
        // log(`Looking Up Owner of ${addrs.rev}`)
        // let owner = await ens.methods.owner(namehash(addrs.rev)).call()
        // updateAddr('revOwn', owner)
        // log('Owner', owner)
  
        // log(`Looking Up Owner of ${name}.${tld}`)
        // owner = await ens.methods.owner(namehash(`${name}.${tld}`)).call()
        // updateAddr('owner', owner)
        // log('Owner', owner)
  
        // log('Creating ENS and Regisrtar Contracts')
        // const registrar = new web3.eth.Contract(registrarAbi, registrarAddress)
        // log('Contracts Completed', `ens:${ens}`, `reg:${registrar}`)

        // log(`Looking Up Owner of ${tld}`)
        // const registrarAddress = await ens.methods.owner(namehash(tld)).call()
        // updateAddr('reg', registrarAddress)
        // log('Owner', registrarAddress)

        // log('Creating ENS and Regisrtar Contracts')
        // const registrar = new web3.eth.Contract(registrarAbi, registrarAddress)
        // log('Contracts Completed', `ens:${ens}`, `reg:${registrar}`)

        // log(`Looking Up Owner of addr.reverse`)
        // const reverseRegistarAddr = await ens.methods.owner(namehash('addr.reverse')).call()
        // updateAddr('revReg', reverseRegistarAddr)
        // log('Owner', reverseRegistarAddr)

        // log(`Creating a Reverse Resolver (${addrs.rev})`)
        // const reverseResolverAddr = await ens.methods.resolver(namehash(addrs.rev)).call()
        // log(reverseResolverAddr) // null
        // const reverseResolver = new web3.eth.Contract(publicResolverAbi, reverseResolverAddr)
        // // let name = await reverseResolver.methods.name(namehash(addrs.rev)).call()
        // // updateAddr('revLook', name)
        // // console.log('Got Reverse Lookup', name)

        // log(`Looking Up Owner of ${addrs.rev}`)
        // let owner = await ens.methods.owner(namehash(addrs.rev)).call()
        // updateAddr('revOwn', owner)
        // log('Owner', owner)

        // log(`Looking Up Owner of ${name}.${tld}`)
        // owner = await ens.methods.owner(namehash(`${name}.${tld}`)).call()
        // updateAddr('owner', owner)
        // log('Owner', owner)

        // log('Caching Contracts')
        // const reverseRegistrar = new web3.eth.Contract(reverseRegistrarAbi, reverseRegistarAddr)
        // const tracts = { reg: registrar, ens: ens, revRes: reverseResolver, revReg: reverseRegistrar }
        // console.log(tracts)
        // setTracts(t => Object.assign({}, t, tracts))
        // log('Done')
      },
      if: () => !!addrs.net && !tracts.revRes,
    },
    {
      name: `Register: ${name}.${tld}`,
      func: async () => {
        if(addrs.owner !== addrs.self) {
          await tracts.reg?.methods.register(web3.utils.sha3(name), addrs.self).send({ from: addrs.self })
          let owner = await tracts.ens?.methods.owner(namehash(`${name}.${tld}`)).call()
          updateAddr('owner', owner)
        }
      },
      if: () => addrs.owner !== addrs.self,
    },
    {
      name: 'Set a Resolver for the New Domain',
      func: async () => {
        await tracts.ens?.methods.setResolver(namehash(`${name}.${tld}`), addrs.resolve).send({ from: addrs.self })
      },
      if: () => !!tracts.ens && !!addrs.resolve,
    },
    {
      name: 'Claim the Reverse Address',
      func: async () => {
        console.log(tracts)
        if(addrs.revOwn !== addrs.self) {
          await tracts.revReg?.methods.claim(addrs.self).send({ from: addrs.self })
          const owner = await tracts.ens?.methods.owner(namehash(addrs.rev ?? '')).call()
          updateAddr('revOwn', owner)
        }
      },
      if: () => !!addrs.rev && !!tracts.revReg
    },
    {
      name: 'Set Resolver and Link Reverse Name',
      func: async () => {
        if(addrs.revLook !== `${name}.${tld}`) {
          const node = await tracts.revReg?.methods.setName(`${name}.${tld}`).send({ from: addrs.self })
          // const revLook = await tracts.revRes?.methods.name(namehash(addrs.rev ?? '')).call()
          // updateAddr('revLook', revLook)
        }
      },
      if: () => !!tracts.ens && !!tracts.revReg
    }
  ]

  return (
    <Container>
      <Stack>
        <Flex>
          <Input
            value={name}
            onChange={evt => setName(evt.target.value)}
          />
          <Input
            value={tld}
            onChange={evt => setTLD(evt.target.value)}
          />
        </Flex>
        <Grid templateColumns="repeat(2, 1fr)">
          {Object.entries(titles).map(([key, title], i) => (
            <>
              <Text m={0}>{title}</Text>
              <Text m={0}>{addrs[key]}</Text>
            </>
          ))}
        </Grid>
      </Stack>
      <Stack>
        {handlers.map((h, i) => (
          <Button
            key={i} onClick={h.func}
            disabled={h.if ? !h.if() : false}
            m={0} py={10} mt="0 ! important"
          >
            {h.name}
          </Button>
        ))}
      </Stack>
    </Container>
  )
//   // // web3.personal.sign(
//   // //   web3.fromUtf8("Howdy-Ho!"),
//   // //   web3.eth.coinbase,
//   // //   (err, sig) => (err ? console.error(err) : console.log(sig))
//   // // )

//   // // ABIs from https://github.com/ensdomains/ens-manager/blob/master/src/api/ens.js
}