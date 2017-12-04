#!/bin/bash

echo "Moving into store-locator-react-native"
cd ../

echo "Attempting to npm pack store-locator-react-native"
npm pack

cd RNStoreLocatorExample
