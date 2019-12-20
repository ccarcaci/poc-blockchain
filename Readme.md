# POC Blockchain

This application is a complete working example on how a [Blockchain](https://bitcoin.org/bitcoin.pdf) works.
It refers to [this article](http://medium.com/@ccarcaci/blockchain-example).

## Prerequisites

- Docker
- npm
- wget: this application uses wget to download the Reddit repository, please make sure it is available in your machine

## How to Use

Launch the entire docker-compose environment by running the script:

```bash
./run.sh
```

From the root folder of the project.

Stop the application using the script:

```bash
./stop.sh
```

## Internal Structure

This project is composed by three different services.

The main service is the Ledger (/ledger) that encapsulate the entire blockchain logic provided by the http API paths:

**GET /chain** (Shows the current chain)

**POST /transaction** (Add the JSON body of the request to the current page of the chain)

**GET /current-page** (Shows the current opened page of the chain)

The remaining services works as support.

**Generator (/generator)** uses Reddit posts to generate transactions.

**Inspector (/inspector)** verifies the entire hash chain and the validity of the POW computated by the Ledger service.

## License

This project is provided under [EUPL-1.2](https://eupl.eu/1.2/en).
