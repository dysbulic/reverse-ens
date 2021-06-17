import { useState } from 'react'
import Web3 from 'web3'
import MetamaskOnboarding from '@metamask/onboarding'
import {
  Stack, Input, Container, Flex, Button, Text, Box, Grid,
} from '@chakra-ui/react'
import { AbiItem } from 'web3-utils'
import { Contract } from 'web3-eth-contract'
import { abi as revRegistrarABI } from '@ensdomains/ens-contracts/artifacts/contracts/registry/ReverseRegistrar.sol/ReverseRegistrar.json'
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

interface Addresses extends Partial<Record<string, string>> {
  self?: string
  address?: string
  owner?: string
  rev?: string
  net?: string
  resolver?: string
  revRegistrar?: string
  ens?: string
  defaultResolver?: string
  revOwner?: string
  revName?: string
}

interface Contracts {
  revResolver?: Contract
  revRegistrar?: Contract
}

// eslint-disable-next-line import/no-anonymous-default-export
export default () => {
  const onboarding = new MetamaskOnboarding()
  const [name, setName] = useState('subdomain.ensname.eth')
  const [titles, setTitles] = useState({
    self: 'Your Address',
    net: 'Current Network',
    revRegistrar: 'Reverse Registrar Address',
    rev: 'Reverse Address',
    owner: null as string | null,
    address: null as string | null,
    revOwner: `Reverse Lookup Owner`,
    resolver: 'Resolver Address',
    revName: 'Reverse Lookup',
  })
  const [addrs, setAddrs] = useState<Addresses>({})
  const [tracts, setTracts] = useState<Contracts>({})

  const updateAddr = (obj: object) => {
    setAddrs(as => ({ ...as, ...obj }))
  }
  const updateTract = (obj: object) => {
    setTracts(ts => ({ ...ts, ...obj }))
  }

  const reset = () => {
    setAddrs({})
    setTracts({})
  }
  ethereum?.on('chainChanged', reset)
  ethereum?.on('accountsChanged',
    (accts: string[]) => {
      reset()
      updateAddr({ self: accts[0] })
    }
  )

  useEffect(() => {
    setTitles((ts) => (
      {
        ...ts,
        owner: `${name} Owner`,
        address: `${name} Address`,
      }
    ))
    setAddrs((as) => (
      { ...as, owner: undefined, address: undefined }
    ))
  }, [name])

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
      name: 'Connect To Ethereum Wallet',
      func: async () => {
        const log = logger('color: purple')
        log('Enabling Inpage Provider')
        const addresses = await (
          ethereum?.request({ method: 'eth_requestAccounts' })
        )
        const addr = addresses?.[0]
        log('Wallet Address', addr)
        updateAddr({ self: addr })
      },
      if: () => (!!ethereum && !addrs.self),
    },
    {
      name: 'Load Addresses',
      func: async () => {
        const log = logger('color: orange; background-color: purple')

        const net = await (async () => {
          const chainId = await web3.eth.getChainId()
          switch(chainId) {
            case 1: return 'mainnet'
            case 2: return 'Morden'
            case 3: return 'Ropsten'
            case 4: return 'Rinkeby'
            case 42: return 'Kovan'
            case 100: return 'xDAI'
            default: return `unknown (id:${chainId})`
          }
        })()
        log('Setting addrs.net', net)
        updateAddr({ net })

        if(!addrs.self) throw new Error('Wallet Address Not Set')
        const revAddr = (
          `${addrs.self.substr(2)}.addr.reverse`
        )
        log('Adding Reverse Address', revAddr)
        updateAddr({ rev: revAddr })

        log('Looking Up addr.reverse Owner')
        const revRegistrar = (
          await web3.eth.ens.getOwner('addr.reverse')
        )
        log('revReg', revRegistrar)
        if(!revRegistrar) {
          throw new Error("Couldn't resolve reverse registrar.")
        }
        log('revReg', revRegistrar)
        updateAddr({ revRegistrar })

        const revOwner = await web3.eth.ens.getOwner(revAddr)
        updateAddr({ revOwner })

        const resolver = await web3.eth.ens.getResolver(name)
        if(/^0x0+$/.test(resolver.options.address)) {
          updateAddr({ address: null, owner: null })
        } else {
          const address = await web3.eth.ens.getAddress(name)
          updateAddr({
            address,
            owner: await web3.eth.ens.getOwner(address),
          })
        }
      },
      if: () => (
        !!addrs.self
        && (
          !addrs.net
          || addrs.address === undefined
          || addrs.owner === undefined
        )
      ),
    },
    {
      name: 'Load Contracts',
      func: async () => {
        const log = logger('color: lightgray; background-color: black')

        if(!addrs.revRegistrar) {
          throw new Error('Reverse Registrar Address Not Set')
        }
        const revRegistrar = new web3.eth.Contract(
          revRegistrarABI as AbiItem[], addrs.revRegistrar
        )
        log('Reverse Registrar', revRegistrar.options.address)
        updateTract({ revRegistrar })

        const defaultResolver = await (
          revRegistrar.methods.defaultResolver().call()
        )
        updateAddr({ defaultResolver })

        if(!addrs.rev) {
          throw new Error('Reverse Address Is Not Set')
        }
        const revResolver = await (
          web3.eth.ens.getResolver(addrs.rev)
        )
        updateTract({ revResolver })
        const resolver = revResolver.options.address
        updateAddr({ resolver })

        if(/^0x0+$/.test(resolver)) {
          updateAddr({ revName: null })
        } else {
          const node = await (
            revRegistrar.methods.node(addrs.self).call()
          )
          const revName = (
            await revResolver.methods.name(node).call()
          )
          updateAddr({ revName })
        }
      },
      if: () => (!!addrs.revRegistrar && !tracts.revRegistrar),
    },
    {
      name: 'Claim the Reverse Address',
      func: async () => {
        if(addrs.revOwner === addrs.self) {
          return alert(
            `This account has already claimed its reverse address. (${
              addrs.self
            })`
          )
        }
        if(!tracts.revRegistrar) {
          throw new Error('Reverse Registrar Contract Not Set')
        }
        await (
          tracts.revRegistrar
          .methods.claim(addrs.self)
          .send({ from: addrs.self })
        )
        if(!addrs.rev) throw new Error('Missing Reverse Address')
        const revOwner = await web3.eth.ens.getOwner(addrs.rev)
        updateAddr({ revOwner })
      },
      if: () => (
        /^0x0+$/.test(addrs.revOwner ?? '') && !!tracts.revRegistrar
      )
    },
    {
      name: 'Link Reverse Name',
      func: async () => {
        if(addrs.revName === name) {
          return alert(`Reverse Already Set To: ${name}`)
        }
        if(
          !addrs.revName
          || window.confirm(`Overwrite ${addrs.revName}?`)
        ) {
          if(!tracts.revRegistrar) {
            throw new Error('Reverse Registrar Not Set')
          }
          await (
            tracts.revRegistrar.methods
            .setName(name)
            .send({ from: addrs.self })
          )

          if(!tracts.revResolver) {
            throw new Error('Reverse Resolver Not Set')
          }
          const node = await (
            tracts.revRegistrar.methods
            .node(addrs.self)
            .call()
          )
          const revName = await (
            tracts.revResolver.methods.name(node).call()
          )
          updateAddr({ revName })
        }
      },
      if: () => (
        !/^0x0+$/.test(addrs.revOwner ?? '')
        && !!tracts.revResolver
        && !!tracts.revRegistrar
      )
    }
  ]

  return (
    <Container>
      <Stack>
        <Flex justify="center">
          <Input
            textAlign="right"
            value={name}
            onChange={evt => setName(evt.target.value)}
          />
        </Flex>
        <Grid templateColumns="auto 1fr" alignItems="center">
          {Object.entries(titles).map(([key, title], i) => (
            <Box key={i} display="contents" sx={{ '&:hover > *': { bg: 'yellow' } }}>
              <Text m={0} textAlign="right" pr={5} minW="12em">{title}:</Text>
              <Text m={0} textOverflow="clip" title={addrs[key]}><code>
                {addrs[key] === null ? <em>Unset</em> : addrs[key]}
              </code></Text>
            </Box>
          ))}
        </Grid>
      </Stack>
      <Stack>
        {handlers.map((h, i) => (
          <Button
            key={i}
            onClick={async () => {
              try {
                await h.func()
              } catch(err) {
                console.error(err)
                alert(err.message)
              }
            }}
            disabled={h.if ? !h.if() : false}
            m={0} py={10} mt="0 ! important"
          >
            {h.name}
          </Button>
        ))}
      </Stack>
    </Container>
  )
}